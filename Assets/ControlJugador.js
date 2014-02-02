var curHp : int = 100;
var maxHp : int = 100;
var theBullet : Rigidbody;
var Speed = 60;

var spawnObject : Transform[];
var spawnNow : Vector3;
var windowRect0 : Rect = Rect (20, 20, 120, 50);
var script: FPSInputController;

var style : GUIStyle = new GUIStyle();
var texture : Texture2D = new Texture2D(128, 128);

var pickup : AudioClip;

var kills : int;
var deaths : int;

function Awake(){
	curHp = maxHp;
	script = GetComponent(FPSInputController);
	spawnNow = transform.position;
	var terreno: GameObject = GameObject.FindGameObjectWithTag("CamaraLogin");
	var net : Networking = terreno.GetComponent(Networking);
	spawnObject = net.spawnObject;
	script.imLive = true;
	kills = 0;
	deaths = 0;
}

function OnGUI () {	    
    if(!script.imLive){
    	GUI.color = Color.red;		
		windowRect0 = GUI.Window (0, windowRect0, DoMyWindow, "Estas Muerto u_u!");
    }else{
    	var vida : float = ((Screen.width / 2) * 0.6);
		GUI.backgroundColor = Color.red;
	    GUI.HorizontalScrollbar(Rect (10,10, vida,20), 0, curHp,0, 100);
    }
}
function DoMyWindow (windowID : int) {
	if (GUI.Button (Rect (10,20,100,20), "Revivir"))
	{
		networkView.RPC("MuerteVivir", RPCMode.OthersBuffered, true);
		curHp = maxHp;
		script.imLive = true;
		var total : int = 0;
		for(var i = 0; i < spawnObject.Length; i++)
			if(spawnObject[i] != null)
				total++;
		var pos = Random.Range(0, total);
		transform.position = spawnObject[pos].position;
	}
	GUI.DragWindow (Rect (0,0,10000,10000));
}

function Update () 
{
	if(transform.position.y <= -100 || curHp < 0) 
	{
		if(transform.position.y <= -100)
			networkView.RPC("Escribir", RPCMode.All, GetComponentInChildren(TextMesh).text + " Se ha suicidado");
		deaths++;
		script.imLive = false;
		transform.position = spawnNow;
		curHp = 0;
		networkView.RPC("MuerteVivir", RPCMode.OthersBuffered, false);		
	}
}

@RPC
function MuerteVivir(tipo : boolean)
{
	gameObject.transform.Find("Personaje").gameObject.SetActive(tipo);
}

@RPC
function AplicarDaamage(viewId : NetworkViewID)
{
	var script: FPSInputController = GetComponent(FPSInputController);
	if(script.imLive)
    	curHp -= 20;
    if(curHp < 0)
    {
    	var nombre : String = getNombre(viewId);
    	if(nombre == "")
    		return;
    	networkView.RPC("Mato", RPCMode.All, viewId);
    	networkView.RPC("Escribir", RPCMode.All, nombre + " a matado a " + GetComponentInChildren(TextMesh).text);
    }
}

function getNombre(viewId : NetworkViewID)
{
	var players : GameObject[] = GameObject.FindGameObjectsWithTag("Player");
	for(var i : int = 0; i < players.Length; i++)
		if(players[i].networkView.viewID.Equals(viewId))
			return players[i].GetComponentInChildren(TextMesh).text;
	return "";
}

@RPC
function Mato(viewId : NetworkViewID)
{
	var players : GameObject[] = GameObject.FindGameObjectsWithTag("Player");
	for(var i : int = 0; i < players.Length; i++)
		if(players[i].networkView.viewID.Equals(viewId))
			players[i].GetComponent(ControlJugador).kills++;
}


@RPC
function Fire()
{
	audio.PlayOneShot(pickup);
	var trans : Transform = transform.gameObject.GetComponentInChildren(Camera).transform;
	var clone = Instantiate(theBullet, trans.position , trans.rotation);
	clone.GetComponent(BalaChoca).viewId = transform.gameObject.networkView.viewID;
	clone.velocity = trans.TransformDirection(Vector3(0, 0, Speed));			
	clone.AddForce(Speed * trans.forward);
	Destroy (clone.gameObject, 3);
}