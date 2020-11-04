import React, { useState } from 'react';
import FilterInput from './FilterInput';
import FilterOptions from './FilterOptions';
import FilterStreamOptions from './FilterStreamOptions';
import CurrentFilters from './CurrentFilters';

const Filter = ({ filterOptions, setFilterOptions }) => {
  // A piece of local state to render the correct options to filter by
  const [selection, setSelection] = useState('');

  // Handles userInput into conditionally rendered input elements
  // Userinput changes with each key inputted
  // On submit, sets filter options at the current text input
  const [userInput, setUserInput] = useState('');
  const [fromTimestamp, setFromTimestamp] = useState({ date: '', time: '' });
  const [toTimestamp, setToTimestamp] = useState({ date: '', time: '' });

  // State to check if filter menu is open
  const [isOpen, setIsOpen] = useState(false);

  const date = new Date();
  const today = date.toISOString().slice(0, 10);

  // TODO: Check if currentTime can/should update constantly (ex: with setTimeout)
  const currentTime = date.getHours() + ':' + date.getMinutes();

  return (
    <div id="filter-container" className="my-8">
      <div id="filter-options">
        <div className="relative inline-block text-left py-1">
          <div>
            <span className="rounded-md shadow-sm">
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
                id="options-menu"
                aria-haspopup="true"
                aria-expanded="true"
                onClick={() => setIsOpen((isOpen) => !isOpen)}
              >
                {selection === ''
                  ? 'Filter'
                  : selection
                      .split('_')
                      .map((word) => word[0].toUpperCase() + word.substr(1))
                      .join(' ')}
                <svg
                  className="-mr-1 ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              {isOpen && (
                <button
                  className="fixed inset-0 h-full w-full bg-black opacity-0 cursor-default"
                  tabIndex={-1}
                  onClick={() => setIsOpen(false)}
                ></button>
              )}
            </span>
          </div>
          {isOpen && (
            <FilterOptions setSelection={setSelection} setIsOpen={setIsOpen} />
          )}
        </div>

        {/* Conditionally renders an input field only for the following options */}
        {(selection === 'container_id' ||
          selection === 'container_name' ||
          selection === 'container_image' ||
          selection === 'status' ||
          selection === 'host_ip' ||
          selection === 'host_port' ||
          selection === 'log_level') && (
          <FilterInput
            selection={selection}
            userInput={userInput}
            setUserInput={setUserInput}
            filterOptions={filterOptions}
            setFilterOptions={setFilterOptions}
          />
        )}

        {/* Conditionally renders stream options */}
        {selection === 'stream' && (
          <FilterStreamOptions
            filterOptions={filterOptions}
            setFilterOptions={setFilterOptions}
          />
        )}

        {/* conditionally renders timestamp options */}
        {/* TODO: check if there is a better way of implementing a timestamp input, currently very bulky and annoying UX */}
        {selection === 'timestamp' && (
          <div className="inline border rounded-md mx-4 pl-4 py-2">
            <div className="inline pr-2 mr-2 border-r">From:</div>
            <input
              id="from-date-input"
              type="date"
              max={today}
              onChange={(e) =>
                setFromTimestamp({ ...fromTimestamp, date: e.target.value })
              }
            ></input>
            <input
              id="from-time-input"
              type="time"
              max={currentTime}
              onChange={(e) => {
                setFromTimestamp({ ...fromTimestamp, time: e.target.value });
              }}
            ></input>
            <div className="inline pr-2 mr-2 border-r">To:</div>
            <input
              id="to-date-input"
              type="date"
              max={today}
              onChange={(e) =>
                setFromTimestamp({ ...fromTimestamp, date: e.target.value })
              }
            ></input>
            <input
              id="to-time-input"
              type="time"
              max={currentTime}
              onChange={(e) =>
                setToTimestamp({ ...fromTimestamp, time: e.target.value })
              }
            ></input>
            <button
              className="font-bold px-4 ml-2 border-l"
              id="timestamp-submit"
              onClick={() => {
                // TODO: Error handling for invalid input (if to is later than from)
                if (
                  fromTimestamp.date &&
                  fromTimestamp.time &&
                  toTimestamp.date &&
                  toTimestamp.time
                ) {
                  const from = fromTimestamp.date + ' ' + fromTimestamp.time;
                  const to = toTimestamp.date + ' ' + toTimestamp.time;
                  setFilterOptions({
                    ...filterOptions,
                    timestamp: {
                      from: from,
                      to: to,
                    },
                  });
                }
              }}
            >
              Submit
            </button>
          </div>
        )}
      </div>

      <CurrentFilters
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
      />
    </div>
  );
};

export default Filter;
