function Awake() {
	if (!networkView.isMine)
	{
		GetComponentInChildren(Camera).enabled = false;
		GetComponentInChildren(AudioListener).enabled = false;
		GetComponent(MouseLook).enabled = false;
		GetComponent(CharacterController).enabled = false;
		GetComponent(ControlJugador).enabled = false;
		//GetComponent(Chat).enabled = false;
	}else{
		var terr : GameObject = GameObject.FindGameObjectWithTag("CamaraLogin");
		var netw : Networking = terr.GetComponent(Networking);
		
		GetComponentInChildren(TextMesh).text = netw.minick; 
		networkView.RPC("MiNick", RPCMode.OthersBuffered, networkView.viewID, netw.minick);		
	}
}

@RPC
function MiNick(viewId : NetworkViewID, nick : String)
{
	GetComponentInChildren(TextMesh).text = nick;
	networkView.RPC("Escribir", RPCMode.All, ("[" + nick + "] Ha Entrado A La Sala"));
}