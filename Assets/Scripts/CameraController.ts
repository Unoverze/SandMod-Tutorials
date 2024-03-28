class CameraController
    extends Component {

    // Camera to be controlled
    @EditorComponentSettings.DecorateName("Our Camera")
    public cam: Camera;

    public smoothSpeed: number = 0.2;

    private inputManager: GameObject;

    private uiComponent: UIComponent; // The InputManager's UI Component
    private canvas: Canvas; // The UI canvas

    private screenMove: Image;

    private cameraViewPosition: Vector2 = Vector2.zero;

    // Executed at first frame
    OnStart(): void {
        this.inputManager = this.gameObject;
        this.uiComponent = this.inputManager.GetComponent<UIComponent>(UIComponent);
        this.canvas = this.uiComponent.canvas;

        this.screenMove = this.canvas.FindChild<Image>(Image, "ScreenTouch");

        // If the screenMove is dragged, Do something...
        this.screenMove.AddEvent(ControlEvent.EventPointerDrag, (control: Control) => {
            const guiData: GUIEventData = control.guiEventData;
            const dragPosition: Vector2 = guiData.moveDelta;
            //dragPosition.y = -dragPosition.y; // Turns the number to an opposite sign (-1 -> 1), Positive to negative and vice versa.
            Debug.Log(dragPosition);
            this.cameraViewPosition = dragPosition;
        });
    }

    // Executed at every frame
    OnUpdate(): void {
        this.rotateCamera(this.cameraViewPosition);
        this.cameraViewPosition = Vector2.zero; // Prevents infinite rotation ...
    }

    private rotateCamera(rotation: Vector2): void {
        let camClampVal: number = 50.00;
        const finalRotation: Vector2 = Vector2.ClampMagnitude(rotation, camClampVal);
        let cameraEulr: Vector3 = this.cam.transform.eulerAngles;
        cameraEulr = cameraEulr.Add(new Vector3(Mathf.Clamp(finalRotation.y, -90, 90), Mathf.Clamp(finalRotation.x, -90, 90), 0)); 

        // Rotates the camera smoothly ...
        const newRotation: Quaternion = Quaternion.Lerp(this.cam.transform.rotation, Quaternion.FromEulerXYZ(cameraEulr.x, cameraEulr.y, 0), this.smoothSpeed);
        this.cam.transform.rotation = newRotation;
    }
}