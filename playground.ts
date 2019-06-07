import Actions from "./classes/actions";
import Cadastros from "./classes/cadastros";
import Cadastros_Documentos from "./classes/cadastros_documentos";

async function f() {
  const action = await Cadastros.findByPk(113);
  if(!action) return false;

  console.log(Cadastros.rawAttributes);

  const documentos = await action.getCadastros_Documentos();
  for(let documento of documentos){
    console.log(documento.id)
  }
}
//
f();