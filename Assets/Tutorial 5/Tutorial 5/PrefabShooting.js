#pragma strict
var crosshair : Texture2D;
var theBullet : Rigidbody;
var Speed = 60;
var script: FPSInputController;
var pickup : AudioClip;

function Awake(){
	script = GetComponent(FPSInputController);
}

function OnGUI ()
{
	GUI.DrawTexture(Rect(Screen.width/2 - 35,Screen.height/2 - 33,64,64), crosshair);
	if(script.imLive)
		Screen.showCursor = false;
	else
		Screen.showCursor = true;
}

function Update ()
{
	if (Input.GetMouseButtonDown(0) && networkView.isMine && script.imLive)
	{	
		//Disparo();
		networkView.RPC("Fire", RPCMode.All); //Es Para OthersBuffered
	}
}

function Disparo()
{
	audio.PlayOneShot(pickup);
	// Remover transform.gameObject
	var trans : Transform = transform.gameObject.GetComponentInChildren(Camera).transform;
	var clone = Instantiate(theBullet, trans.position , trans.rotation);
	clone.velocity = trans.TransformDirection(Vector3(0, 0, Speed));			
	clone.AddForce(Speed * trans.forward);
	Destroy (clone.gameObject, 3);
}