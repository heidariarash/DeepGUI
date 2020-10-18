const fs = require('fs').promises;

const save_diagram = async (diagram, dimension, file_path) => {
    let output = {};
    output.layers = diagram.layers;
    output.framework = diagram.framework;
    output.lr = diagram.lr;
    output.loss = diagram.loss;
    output.optimizer = diagram.optimizer,
    output.epoch = diagram.epoch;
    output.batch = diagram.batch;
    output.dimensions = dimension;
    output = JSON.stringify(output);
    try {
        await fs.writeFile(file_path, output, 'utf8');
        return true;
    }
    catch(err){
        return false;
    }
}

module.exports.save_diagram = save_diagram;