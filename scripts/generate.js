generate_code = (options, path) => {
    //creating the string to write (stw)
    stw = "";
    if(options.framework === "TensorFlow"){
        stw += "import tensorflow as tf\n";
        stw += "import tensorflow.keras as keras\n\n\n";
        stw += "model = keras.models.Sequntial()\n\n"

        for(layer of options.layers){
            switch(layer.name){
                //linear case
                case "Linear":
                    if(layer.activation === "No Activation"){
                        stw += `model.add(keras.layers.Dense(${layer.unit_num}))`
                    }
                    else {
                        stw += `model.add(keras.layers.Dense(${layer.unit_num}, activation = ${layer.activation}))`
                    }
                    break;

                //convolution 1D case
                case "Convolution 1D":
                    if(layer.activation === "No Activation"){
                        stw += `model.add(keras.layers.Conv1D(${layer.filter_num}), ${layre.filter_size}, strides = ${layer.stride})`
                    }
                    else {
                        stw += `model.add(keras.layers.Conv1D(${layer.filter_num}), ${layre.filter_size}, strides = ${layer.stride}, activation = ${layer.activation})`
                    }
                    break;

                //convolution 2D case
                case "Convolution 2D":
                    if(layer.activation === "No Activation"){
                        stw += `model.add(keras.layers.Conv2D(${layer.filter_num}), (${layre.filter_size[0]}, ${layre.filter_size[1]}), strides = ${layer.stride})`
                    }
                    else {
                        stw += `model.add(keras.layers.Conv2D(${layer.filter_num}), (${layre.filter_size[0]}, ${layre.filter_size[1]}), strides = ${layer.stride}, activation = ${layer.activation})`
                    }
                    break;

                //convolution 3D case
                case "Convolution 3D":
                    if(layer.activation === "No Activation"){
                        stw += `model.add(keras.layers.Conv3D(${layer.filter_num}), (${layre.filter_size[0]}, ${layre.filter_size[1]}, ${layer.filter_size[2]}), strides = ${layer.stride})`
                    }
                    else {
                        stw += `model.add(keras.layers.Conv3D(${layer.filter_num}), (${layre.filter_size[0]}, ${layre.filter_size[1]}, ${layer.filter_size[2]}), strides = ${layer.stride}, activation = ${layer.activation})`
                    }
                    break;

                //max pool 1D case
                case "Max Pool 1D":
                    stw += `model.add(keras.layers.MaxPooling1D(${layer.filter_size}, strides = ${layer.stride})`
                    break;

                //max pool 2D case
                case "Max Pool 2D":
                    stw += `model.add(keras.layers.MaxPooling2D((${layre.filter_size[0]}, ${layre.filter_size[1]}), strides = ${layer.stride})`
                    break;

                //max pool 3D case
                case "Max Pool 3D":
                    stw += `model.add(keras.layers.MaxPooling3D((${layre.filter_size[0]}, ${layre.filter_size[1]}, ${layer.filter_size[2]}), strides = ${layer.stride})`
                    break;

                //max pool 3D case
                case "Activation":
                    stw += `model.add(keras.layers.${layer.type}())`
            }
            stw += "\n"
        }

        console.log(stw)
    }
}

module.exports = generate_code;