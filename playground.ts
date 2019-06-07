import Actions from "./models/actions";

async function f() {
  const action = await Actions.findAll();
  if(action){
    console.log(action);
  }
}

f();