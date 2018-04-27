const Form = use('lib/Form');

class Controller {
  validate(data,rules) {
    const form = new Form(rules);

    form.bindValues(data);
    form.validate();

    return form;
  }
}

module.exports = Controller;