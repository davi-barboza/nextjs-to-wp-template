'use client'
import { GetEquipamentosDocument } from "@/graphql/@generated/graphql";
import { useQuery } from "@apollo/client/react";
import React from "react";

const Dashboard = () => {
  const { data } = useQuery(GetEquipamentosDocument);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <h1>Super teste</h1>

      {data?.equipamentos?.nodes.map((node) => (
        <span key={node.id}>{JSON.stringify(node)}</span>
      ))}
    </div>
  );
};

export default Dashboard;
