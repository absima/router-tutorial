import { useEffect } from 'react';
import {
  Outlet,
  NavLink,
  useLoaderData,
  Form,
  redirect,
  useNavigation,
  useSubmit,
} from 'react-router-dom';
import { getContacts, createContact } from '../contacts';

// export async function action () {
//   const contact = await createContact();
//   return { contact };
// }
export async function action() {
  const contact = await createContact();
  return redirect(`/contacts/${contact._id}/edit`);
}

// export async function loader() {
//   const contacts = await getContacts();
//   return { contacts };
// }
export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const contacts = await getContacts(q);
  return { contacts, q };
}

export default function Root() {
  const { contacts, q } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has('q');

  console.log('q', q);
  console.log('navigation', navigation);

  useEffect(() => {
    document.getElementById('q').value = q;
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching ? 'loading' : ''}
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              onChange={(event) => {
                // submit(event.currentTarget.form);
                const isFirstSearch = q == null;
                if (isFirstSearch) {
                  submit(event.currentTarget.form);
                }
              }}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact._id}>
                  <NavLink
                    to={`contacts/${contact._id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? 'active' : isPending ? 'pending' : ''
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{' '}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === 'loading' ? 'loading' : ''}
      >
        <Outlet />
      </div>
    </>
  );
}
