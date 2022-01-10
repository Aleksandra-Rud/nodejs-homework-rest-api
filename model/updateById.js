const updateContact = require("./updateContact");
const listContacts = require("./listContacts");

const updateById = async ({ id, name, email, phone }) => {
  const contacts = await listContacts();
  const idx = contacts.findIndex((item) => item.id === id);
  if (idx === -1) {
    return null;
  }
  contacts[idx] = { id, name, email, phone };
  await updateContact(contacts);
  return contacts[idx];
};

module.exports = updateById;
