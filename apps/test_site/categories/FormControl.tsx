import { CategoryTitle, ExampleList } from "../components";
import { CoolCheckbox } from "../components/CoolCheckbox";

const formClassNames = "border border-gray-300 rounded p-1";

export const FormControl = () => (
  <>
    <CategoryTitle>Form Controls</CategoryTitle>
    <ExampleList
      examples={[
        {
          title: "Input",
          body: <input type="text" className={formClassNames} />,
        },
        {
          title: "Input with label",
          body: (
            <>
              <label htmlFor="inputWithLabel" className="block">
                Input
              </label>
              <input
                type="text"
                id="inputWithLabel"
                className={formClassNames}
              />
            </>
          ),
        },

        {
          title: "Select",
          body: (
            <select className={formClassNames}>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
              <option value="3">Option 3</option>
            </select>
          ),
        },
        {
          title: "Select with label",
          body: (
            <>
              <label htmlFor="selectWithLabel" className="block">
                Select
              </label>
              <select id="selectWithLabel" className={formClassNames}>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
              </select>
            </>
          ),
        },
        {
          title: "Textarea",
          body: <textarea className="intentional-violation" />,
        },
        {
          title: "Textarea with label",
          body: (
            <>
              <label htmlFor="textareaWithLabel" className="block">
                Textarea
              </label>
              <textarea id="textareaWithLabel" />
            </>
          ),
        },
        {
          title: "Radio",
          body: (
            <div className="flex flex-wrap gap-3">
              <span>
                <input type="radio" id="radio1" name="radio" />
                <label htmlFor="radio1">Radio 1</label>
              </span>
              <span>
                <input type="radio" id="radio2" name="radio" />
                <label htmlFor="radio2">Radio 2</label>
              </span>
            </div>
          ),
        },
        {
          title: "radio without label",
          body: (
            <div className="flex flex-wrap gap-3">
              <span>
                <input
                  type="radio"
                  id="radioWithoutLabel1"
                  name="radio"
                  className="intentional-violation"
                />
                Radio 1
              </span>
              <span>
                <input
                  type="radio"
                  id="radioWithoutLabel2"
                  name="radio"
                  className="intentional-violation"
                />
                Radio 2
              </span>
            </div>
          ),
        },
        {
          title: "Radio without name attribute",
          body: (
            <div className="flex flex-wrap gap-3">
              <span>
                <input type="radio" id="radioWithoutName1" />
                <label htmlFor="radioWithoutName1">Radio 1</label>
              </span>
              <span>
                <input type="radio" id="radioWithoutName2" />
                <label htmlFor="radioWithoutName2">Radio 2</label>
              </span>
            </div>
          ),
        },
        {
          title: "Radio failed grouping",
          body: (
            <div className="flex flex-wrap gap-3">
              <span>
                <input
                  type="radio"
                  id="radioFailedGrouping1"
                  name="radioFailedGrouping1"
                />
                <label htmlFor="radioFailedGrouping1">Radio 1</label>
              </span>
              <span>
                <input
                  type="radio"
                  id="radioFailedGrouping2"
                  name="radioFailedGrouping2"
                />
                <label htmlFor="radioFailedGrouping2">Radio 2</label>
              </span>
            </div>
          ),
        },
        {
          title: "Checkbox",
          body: (
            <div className="flex flex-wrap gap-3">
              <span>
                <input type="checkbox" id="checkbox1" />
                <label htmlFor="checkbox1">Checkbox 1</label>
              </span>
              <span>
                <input type="checkbox" id="checkbox2" />
                <label htmlFor="checkbox2">Checkbox 2</label>
              </span>
            </div>
          ),
        },
        {
          title: "Checkbox without label",
          body: (
            <div className="flex flex-wrap gap-3">
              <span>
                <input
                  type="checkbox"
                  id="checkboxWithoutLabel1"
                  className="intentional-violation"
                />
                Checkbox 1
              </span>
              <span>
                <input
                  type="checkbox"
                  id="checkboxWithoutLabel2"
                  className="intentional-violation"
                />
                Checkbox 2
              </span>
            </div>
          ),
        },
        {
          title: "Checkbox display: none",
          body: <CoolCheckbox />,
        },
        {
          title: "Single Label",
          body: <label className="intentional-violation">Single Label</label>,
        },
        {
          title: "required input",
          body: (
            <>
              <label htmlFor="requiredInput" className="block">
                Input
              </label>

              <input
                id="requiredInput"
                type="text"
                className={formClassNames}
                required
              />
            </>
          ),
        },
        {
          title: "readonly input",
          body: (
            <>
              <label htmlFor="readonlyInput" className="block">
                Input
              </label>
              <input
                id="readonlyInput"
                type="text"
                className={formClassNames}
                readOnly
              />
            </>
          ),
        },
      ]}
    />
  </>
);
