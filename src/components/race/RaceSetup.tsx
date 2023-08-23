import React, { useState } from "react";
import { Button, Label } from "flowbite-react";
import ButtonGroup from "flowbite-react/lib/esm/components/Button/ButtonGroup";
import { TrashIcon } from "@heroicons/react/20/solid";

function RaceSetup({
  runner: runnerForm,
  setRunner: setRunnerForm,
}: {
  runner: RaceRunner[];
  setRunner: (value: RaceRunner[]) => void;
}) {
  const [runnersData, setRunnersData] = useState("");

  const handleLoadRunners = () => {
    if (!runnersData) return;
    const parsedData = JSON.parse(runnersData) as RaceRunner[];
    setRunnerForm(parsedData);
  };

  const addRunner = () => {
    setRunnerForm([...runnerForm, { name: "" }]);
  };

  const deleteRunner = (index: number) => {
    setRunnerForm([
      ...runnerForm.slice(0, index),
      ...runnerForm.slice(index + 1, runnerForm.length),
    ]);
  };

  return (
    <div className="max-w-2xl w-full px-4 py-8 mx-auto lg:py-16">
      <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
        <div className="sm:col-span-2">
          <Label htmlFor="runnersData">JSON Data:</Label>
          <textarea
            id="runnersData"
            placeholder='[ { "name": "Runner1", "imageUrl": "url1" }, ... ]'
            rows={8}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            value={runnersData}
            onChange={(e) => setRunnersData(e.target.value)}
          />
          <Button className="w-full" onClick={handleLoadRunners}>
            Load Runners
          </Button>
        </div>
      </div>
      <div id="runnerNamesForm" className="mt-4">
        {runnerForm.map((runner, index) => (
          <div key={index} className="mb-4">
            <div className="flex align-middle mb-2">
              <label
                htmlFor={`runnerName${index + 1}`}
                className="inline-block "
              >
                Runner {index + 1} Name:
              </label>
              <TrashIcon
                color="red"
                className="inline-block h-5 w-5"
                aria-hidden="true"
                onClick={() => deleteRunner(index)}
              />
            </div>
            <input
              type="text"
              id={`runnerName${index + 1}`}
              className="border rounded mb-2 block w-full"
              value={runner.name}
              onChange={(e) => {
                const updatedForm = [...runnerForm];
                updatedForm[index].name = e.target.value;
                setRunnerForm(updatedForm);
              }}
            />
            <label htmlFor={`runnerImage${index + 1}`} className="block mb-2">
              Runner {index + 1} Image URL:
            </label>

            <input
              type="text"
              id={`runnerImage${index + 1}`}
              className="border rounded block w-full"
              value={runner.imageUrl}
              onChange={(e) => {
                const updatedForm = [...runnerForm];
                updatedForm[index].imageUrl = e.target.value;
                setRunnerForm(updatedForm);
              }}
            />
          </div>
        ))}
        <Button color="green" onClick={addRunner}>
          Add Runners
        </Button>
        <ButtonGroup className="mt-4"></ButtonGroup>
      </div>
    </div>
  );
}

export default RaceSetup;
