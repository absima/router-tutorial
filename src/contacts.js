// import { matchSorter } from "match-sorter";
// import sortBy from "sort-by";

const createContact = async () => {
  const response = await fetch('http://localhost:3000/contact', {
    method: 'POST',
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(response.statusText);
  }
};

const getContact = async (id) => {
  const response = await fetch(`http://localhost:3000/contact/${id}`);
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(response.statusText);
  }
};

const getContacts = async (q) => {
  const response = await fetch(`http://localhost:3000/contact`);
  if (response.ok) {
    let contacts = await response.json();
    if (q) {
      // filter contacts with first or last that start with q
      contacts = contacts.filter((contact) => {
        return (
          contact.first.toLowerCase().startsWith(q.toLowerCase()) ||
          contact.last.toLowerCase().startsWith(q.toLowerCase())
        );  
      });
    }
    return contacts; //.sort(sortBy("last", "createdAt"));
  } else {
    throw new Error(response.statusText);
  }
};

// update contact using id and modified contact object

const updateContact = async (id, modified) => {
  const response = await fetch(`http://localhost:3000/contact/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(modified),
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(response.statusText);
  }
};

const deleteContact = async (id) => {
  const response = await fetch(`http://localhost:3000/contact/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
};

export { createContact, getContact, getContacts, updateContact, deleteContact };
