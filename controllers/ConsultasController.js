import * as ConsultasModel from "../models/ConsultasModel.js";

export const getBusqueda = async (req, res) => {
  const { cadBusq } = req.query;
  const companies = await ConsultasModel.getBusqueda(cadBusq);
  res.json(companies);
};
