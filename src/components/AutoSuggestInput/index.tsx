import { useState } from "react";
import "./style.css";
import Autosuggest from "react-autosuggest";

function renderSuggestion(suggestion: string) {
  return <span>{suggestion}</span>;
}
function escapeRegexCharacters(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const AutoSuggestInput = ({
  value,
  onChange,
  list,
  ...inputPorps
}: {
  list: string[];
  value: string;
  onChange: (value: string) => void;
  type?: string;
  id?: string;
  required?: boolean;
  autoComplete?: string;
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const getSuggestions = (suggestion: string) => {
    const escapedValue = escapeRegexCharacters(suggestion.trim());
    if (suggestion === "") {
      return [];
    }
    const regex = new RegExp("^" + escapedValue, "i");
    return list.filter((item) => regex.test(item));
  };

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    setSuggestions(getSuggestions(value));
  };
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };
  const getSuggestionValue = (suggestion: string) => {
    return suggestion;
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      inputProps={{
        ...inputPorps,
        className:
          "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
        value,
        onChange: (_, { newValue }) => onChange(newValue),
      }}
      containerProps={{
        className: "react-autosuggest__container text-gray-700",
      }}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
    />
  );
};

export default AutoSuggestInput;
