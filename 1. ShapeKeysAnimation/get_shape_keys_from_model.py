bl_info = {
    "name": "Extract Shape Keys",
    "category": "Object",
}

import bpy
import json


class ObjectMoveX(bpy.types.Operator):
    """Shape Keys extraction Script"""      # blender will use this as a tooltip for menu items and buttons.
    bl_idname = "object.extract_shape"        # unique identifier for buttons and menu items to reference.
    bl_label = "Extract Shape Keys"         # display name in the interface.


    def execute(self, context):        # execute() is called by blender when running the operator.
        data = []
        C = bpy.context
        sce = C.scene

        def get_key_values(scene, context, key_name):
            out = []
            for i in range(scene.frame_start, scene.frame_end+1):
                scene.frame_set(i)
                value = keyBlocks[key_name].value
                out.append({
                    'i': i,
                    'key_value': value
                })
            return out

        for object in bpy.data.objects:
            obj = {}
            if object.type == 'MESH' and object.data.shape_keys:
                obj['name'] = object.name
                obj['keys'] = []
                keyBlocks = object.data.shape_keys.key_blocks
                
                for block in keyBlocks:
                    if block.name != 'Basis':
                        obj['keys'].append({
                            'key_name': block.name,
                            'key_values': get_key_values(sce, keyBlocks, block.name)
                        })

                data.append(obj)

        with open('shape_without_basis.json', 'w') as fp:
            json.dump(data, fp)

        return {'FINISHED'}            # this lets blender know the operator finished successfully.

def register():
    bpy.utils.register_class(ObjectMoveX)


def unregister():
    bpy.utils.unregister_class(ObjectMoveX)


# This allows you to run the script directly from blenders text editor
# to test the addon without having to install it.
if __name__ == "__main__":
    register()