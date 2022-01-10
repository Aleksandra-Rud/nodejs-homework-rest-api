const fs = require("fs/promises");

const contactsPath = require("./contactsPath");

const updateContact = async (contacts) => {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
};

module.exports = updateContact;
