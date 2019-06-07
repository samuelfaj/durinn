import Actions from "./classes/actions";

async function f() {
  const action = await Actions.findByPk(1);
  if(action){
    action.id = 2;
    await action.save();
  }
}

f();