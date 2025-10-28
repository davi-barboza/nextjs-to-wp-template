import {
  DeletarEquipamentoDocument,
  GetEquipamentosDocument,
} from "@/graphql/@generated/graphql";
import { useMutation, useQuery } from "@apollo/client/react";
import React from "react";

const Medias: React.FC = () => {
  const { data } = useQuery(GetEquipamentosDocument);

  const [deletarEquipamento] = useMutation(DeletarEquipamentoDocument, {
    refetchQueries: [GetEquipamentosDocument],
  });

  const deleteUser = (id: string) => {
    deletarEquipamento({ variables: { input: { id } } });
  };

  return (
    <div>
      {data?.equipamentos?.nodes.map((node) => (
        <div key={node.id}>
          <div>{JSON.stringify(node)}</div>
          <button onClick={() => deleteUser(node.id)}>
            Deletar Equipamento
          </button>
        </div>
      ))}
    </div>
  );
};

export default Medias;
