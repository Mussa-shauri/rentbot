const Tenant = require("../models/Tenant");

exports.getTenants = async (req, res) => {
  const tenants = await Tenant.find().populate("property");

  res.json(tenants);
};

exports.createTenant = async (req, res) => {
  const tenant = await Tenant.create(req.body);

  res.status(201).json(tenant);
};