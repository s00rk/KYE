var playerPrefab : GameObject;
var spawnObject : Transform[];
var ipServer : String = "s00rk.sytes.net";
var portServer : int = 25001;

var gameName : String = "s00rk";
var roomName : String = "Servidor";
var minick : String = "Aqui Tu Nick";
private var refreshing : boolean = false;
private var hostData : HostData[];

var bgsound : AudioClip;

function OnGUI () {

	if(!Network.isClient && !Network.isServer)
	{
		minick = GUI.TextArea(new Rect(Screen.width/2, Screen.height/2 - 60, 120,25), minick);
		roomName = GUI.TextArea(new Rect(Screen.width/2 - 130, Screen.height/2, 120,25), roomName);
		if (GUI.Button(Rect(Screen.width/2,Screen.height/2,120,20),"Iniciar Servidor"))
		{
        	startServer();
		}
		
		ipServer = GUI.TextArea(new Rect(Screen.width/2 + 130, Screen.height/2 +30 - 20 ,120,25),ipServer);
		portServer = int.Parse(GUI.TextArea(new Rect(Screen.width/2 + 130, Screen.height/2 +30 + 10, 120,25),portServer.ToString()));
		if(GUI.Button(Rect(Screen.width/2, Screen.height/2 + 30, 120, 20), "Conectar a Cliente"))
		{
			Network.Connect(ipServer, portServer);
		}

 		if (GUI.Button(Rect(Screen.width/2,Screen.height/2 + 60,120,20),"Refresh Hosts"))
 		{
        	Debug.Log("Refresh");
        	refreshHostList();
		}
		if(hostData)
		{
			for(var i:int = 0; i<hostData.length; i++)
			{
				if(GUI.Button(Rect(Screen.width/2,Screen.height/2 + 90 + (i*30),120,20),hostData[i].gameName))
				{
					Network.Connect(hostData[i]);
				}
			}
		}
	}
}


function Update ()
{
	if(refreshing)
	{
		if(MasterServer.PollHostList().Length > 0)
		{
			refreshing = false;
			Debug.Log(MasterServer.PollHostList().Length);
			hostData = MasterServer.PollHostList();		
		}	
	}
}


function startServer ()
{
	Network.InitializeServer(32,25001, !Network.HavePublicAddress);
	MasterServer.RegisterHost(gameName, roomName, "");	
}
	
function OnServerInitialized ()
{
	Debug.Log("server initialized");
	spawnPlayer();	
}

function OnConnectedToServer () 
{
	spawnPlayer();
}

function spawnPlayer () 
{	
	GetComponent(AudioSource).enabled = false;
	GetComponent(AudioListener).enabled = false;
	var total : int = 0;
	for(var i = 0; i < spawnObject.Length; i++)
		if(spawnObject[i] != null)
			total++;
	var pos = Random.Range(0, total);
	Network.Instantiate(playerPrefab, spawnObject[pos].position, Quaternion.identity, 0);
}

function OnPlayerDisconnected(player: NetworkPlayer) {
	Network.RemoveRPCs(player);
	Network.DestroyPlayerObjects(player);
}

function OnDisconnectedFromServer(info : NetworkDisconnection) {
	if (Network.isServer) {
		Debug.Log("Local server connection disconnected");
	}else {
		var goPlayers = GameObject.FindGameObjectsWithTag("Player");
		var p = null;
		for(var i = 0; i < goPlayers.Length && p == null; i++)
		{
			Destroy(goPlayers[i]);
		}
		//Network.Destroy(playerPrefab);
		if (info == NetworkDisconnection.LostConnection)
			Debug.Log("Lost connection to the server");
		else
			Debug.Log("Successfully diconnected from the server");
	}
	GetComponent(AudioSource).enabled = true;
	GetComponent(AudioListener).enabled = true;
	Screen.showCursor = true;
}

@RPC
function spawnPlayerNetwork()
{
	Network.Instantiate(playerPrefab, spawnObject.position, Quaternion.identity, 0);
}

function OnMasterServerEvent(mse:MasterServerEvent) 
{
	if(mse == MasterServerEvent.RegistrationSucceeded) 
	{
		Debug.Log("Registered Server");	
	}	
}
	
	
function refreshHostList () 
{
	MasterServer.RequestHostList(gameName);
	refreshing = true;	
}