@script AddComponentMenu ("Character/Mouse Look")


enum RotationAxes { MouseXAndY = 0, MouseX = 1, MouseY = 2 }
var axes : RotationAxes = RotationAxes.MouseXAndY;
var sensitivityX : float = 15F;
var sensitivityY : float = 15F;

var minimumX :float = -360F;
var maximumX : float = 360F;

var minimumY : float = -60F;
var maximumY : float = 60F;
var isJumping = false;

var rotationY : float = 0F;

function Update ()
	{
		var chmotor : CharacterMotor = GetComponent(CharacterMotor);
		if (axes == RotationAxes.MouseXAndY)
		{
			var rotationX :float = transform.localEulerAngles.y + Input.GetAxis("Mouse X") * sensitivityX;
			var sens : float = sensitivityY;
			if(chmotor.IsJumping())
				sens = 1F;
			rotationY += Input.GetAxis("Mouse Y") * sens;
			rotationY = Mathf.Clamp (rotationY, minimumY, maximumY);
			
			transform.localEulerAngles = new Vector3(-rotationY, rotationX, 0);
		}
		else if (axes == RotationAxes.MouseY)
		{
			rotationY += Input.GetAxis("Mouse Y") * sensitivityY;
			rotationY = Mathf.Clamp (rotationY, minimumY, maximumY);
			
			transform.localEulerAngles = new Vector3(-rotationY, transform.localEulerAngles.y, 0);
		}
		else
		{
			transform.Rotate(0, Input.GetAxis("Mouse X") * sensitivityX, 0);
		}
	}
	
	function Start ()
	{
		// Make the rigid body not change rotation
		if (rigidbody)
			rigidbody.freezeRotation = true;
	}
