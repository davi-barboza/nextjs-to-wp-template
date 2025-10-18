import { GetEquipamentosDocument } from "@/graphql/@generated/graphql";
import { useQuery } from "@apollo/client/react";
import Image from "next/image";
import React from "react";

const Medias: React.FC = () => {
  const { data } = useQuery(GetEquipamentosDocument);

  // return (
  //   <div>
  //     {dataMedias?.mediaItems?.nodes.map((node) => (
  //       <Image
  //         key={node?.id}
  //         src={node.sourceUrl ?? ""}
  //         alt={node.altText ?? ""}
  //         title={node.altText ?? ""}
  //       />
  //     ))}
  //   </div>
  // );
  return (
    <div>
      {data?.equipamentos?.nodes.map((node) => (
        <div key={node.id}>
          {JSON.stringify(node)}
        </div>
      ))}
    </div>
  );
};

export default Medias;
