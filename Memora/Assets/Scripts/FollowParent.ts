// @input parentObject: SceneObject

@component
export class FollowParent extends BaseScriptComponent {

    @input parentObject: SceneObject;

    onUpdate(): void {
        if (!this.parentObject) {
            print("No parent assigned!");
            return;
        }

        const parentTransform = this.parentObject.getTransform();
        const myTransform = this.getTransform();

        myTransform.setWorldPosition(parentTransform.getWorldPosition());
        myTransform.setWorldRotation(parentTransform.getWorldRotation());
        myTransform.setWorldScale(parentTransform.getWorldScale());
    }
}
