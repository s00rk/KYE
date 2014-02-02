var viewId : NetworkViewID;
function OnCollisionStay (hit : Collision) {	
	if( hit.collider.tag ==  "Player" )
	{
		var script: FPSInputController = hit.gameObject.GetComponent(FPSInputController);
		if(script.imLive && hit.gameObject.networkView.isMine)
		{
			Debug.Log("Golpe: " + hit.gameObject.networkView.viewID + " " + this.viewId);
			hit.gameObject.SendMessage("AplicarDaamage", this.viewId);		
			Destroy(gameObject);
		}
	}else
		Destroy(gameObject);
}