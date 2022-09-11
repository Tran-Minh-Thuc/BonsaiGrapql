const Pluralize = require('pluralize');

const config = plop => {
    // module generator
    plop.setGenerator('Base Module', {
        description: 'Create a module with base CRUD feature',
        prompts: [{
            type: 'input',
            name: 'name',
            message: "Module's name:"
        }, ], // array of inquirer prompts

        actions: [{
                    type: 'add',
                    path: 'src/modules/{{camelCase name}}/{{camelCase name}}.schema.ts',
                    templateFile: 'plop_templates/module/schema.hbs'
                },

                {
                    type: 'add',
                    path: 'src/modules/{{camelCase name}}/{{camelCase name}}.model.ts',
                    templateFile: 'plop_templates/module/model.hbs'
                },
                {
                    type: 'add',
                    path: 'src/modules/{{camelCase name}}/{{camelCase name}}.resolver.ts',
                    templateFile: 'plop_templates/module/resolver.hbs'
                },
                {
                    type: 'add',
                    path: 'src/modules/{{camelCase name}}/{{camelCase name}}.service.ts',
                    templateFile: 'plop_templates/module/service.hbs'
                },
                // {
                //     type: 'add',
                //     path: 'src/modules/{{camelCase name}}/{{camelCase name}}.test.ts',
                //     templateFile: 'plop_templates/module/test.hbs'
                // }
            ] // array of actions
    });

    plop.setGenerator('Empty Module', {
        description: 'Just create a module with no content',
        prompts: [{
            type: 'input',
            name: 'name',
            message: "Module's name:"
        }, ], // array of inquirer prompts

        actions: [{
                    type: 'add',
                    path: 'src/modules/{{camelCase name}}/{{camelCase name}}.schema.ts',
                },

                {
                    type: 'add',
                    path: 'src/modules/{{camelCase name}}/{{camelCase name}}.model.ts',
                },
                {
                    type: 'add',
                    path: 'src/modules/{{camelCase name}}/{{camelCase name}}.resolver.ts',
                },
                {
                    type: 'add',
                    path: 'src/modules/{{camelCase name}}/{{camelCase name}}.service.ts',
                }
            ] // array of actions
    });

    // ------------ plop helper ------
    // singular nouns to plural nouns
    plop.setHelper('pluralize', function(text) {
        return Pluralize(text, 0);
    });

    // camelCase
    plop.setHelper('camelCase', function(text) {
        const regex = /\s|-|_/g;
        text = text.toLowerCase();
        let words = text.split(regex);

        words = words.map((word, index) => {
            return index != 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word;
        });

        return words.join('');
    });

    // properCase
    plop.setHelper('properCase', function(text) {
        const regex = /\s|-|_/g;
        text = text.toLowerCase();
        let words = text.split(regex);

        words = words.map((word, index) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        });

        return words.join('');
    });
}

module.exports = config