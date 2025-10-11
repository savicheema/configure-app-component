import React from "react";

export type Person = {
  name: string;
  age: number;
};

const MyComponent = ({ person }: { person: Person }) => {
  return (
    <div data-testid="my-component">
      {person.name} is {person.age} years old and stupid.
    </div>
  );
};

export default MyComponent;
