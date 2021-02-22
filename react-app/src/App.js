import React, { useState, useEffect } from "react";
import "./App.css";

const Parse = require("parse");

Parse.initialize("appid", null, "masterkey");

Parse.serverURL = "http://localhost:1337/parse";

const Person = Parse.Object.extend("Person");

const App = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [people, setPeople] = useState([]);

  const personQuery = new Parse.Query(Person);

  const initialQuery = () => {
    personQuery.find().then(
      (res) => {
        const mapped = res.map((r) => {
          const { name, age } = r.attributes;
          return { name, age, ref: r };
        });

        setPeople(mapped);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const addPerson = (person) => {
    const { name, age } = person.attributes;
    setPeople((people) => [...people, { name, age, ref: person }]);
  };

  const removePerson = (person) => {
    setPeople((people) => people.filter((p) => p.ref.id !== person.id));
  };

  const setupSubscription = async () => {
    const personSub = await personQuery.subscribe();

    personSub.on("open", () => console.log("subscribed to Person!"));

    personSub.on("create", (person) => {
      addPerson(person);
    });

    personSub.on("delete", (person) => {
      removePerson(person);
    });
  };

  useEffect(() => {
    initialQuery();
    setupSubscription();
  }, []);

  const savePerson = () => {
    new Person()
      .save({
        name: name,
        age: age,
      })
      .then(
        () => console.log("saved!"),
        (error) => {
          alert(
            "Failed to create new object, with error code: " + error.message
          );
        }
      );

    setName("");
    setAge("");
  };

  const destroyPerson = (p) => {
    p.ref.destroy().then(
      () => console.log("destroyed!"),
      (error) => {
        alert("Failed to desrtoy object, with error code: " + error.message);
      }
    );
  };

  return (
    <div className="App">
      <div>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Age
          <input value={age} onChange={(e) => setAge(e.target.value)} />
        </label>
        <button onClick={savePerson}>Save</button>
      </div>
      <div>
        {people.map((p) => (
          <>
            <span>
              {p.name} {p.age}
            </span>
            <button onClick={() => destroyPerson(p)}>Destroy</button>
            <br />
          </>
        ))}
      </div>
    </div>
  );
};

export default App;
