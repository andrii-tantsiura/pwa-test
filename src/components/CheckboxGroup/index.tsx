import { ChangeEvent, FC, SetStateAction, useCallback, useEffect } from "react";
import { Form } from "react-bootstrap";

export interface IOption {
  id: string;
  label: string;
  checked: boolean;
}

interface CheckboxGroupProps {
  items: IOption[];
  canCheckAll?: boolean;
  onChange: (items: SetStateAction<IOption[]>) => void;
}

const ALL_ITEMS_OPTION: Readonly<IOption> = Object.freeze({
  id: "Всі",
  label: "Всі",
  checked: false,
});

export const CheckboxGroup: FC<CheckboxGroupProps> = ({
  canCheckAll,
  items,
  onChange,
}) => {
  const handleOptionsChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const targetId = e.target.id;

      const updatedItems = items.map((item) =>
        item.id === targetId ? { ...item, checked: !item.checked } : item
      );

      if (canCheckAll && targetId === ALL_ITEMS_OPTION.id) {
        const checked = !items[0].checked;

        onChange(items.map((item) => ({ ...item, checked })));
      } else if (canCheckAll) {
        const isAllChecked = updatedItems
          .slice(1)
          .every(({ checked }) => checked);

        updatedItems[0].checked = isAllChecked;

        onChange(updatedItems);
      } else {
        onChange(updatedItems);
      }
    },
    [canCheckAll, items, onChange]
  );

  useEffect(() => {
    if (
      canCheckAll &&
      items.length > 0 &&
      items[0].id !== ALL_ITEMS_OPTION.id
    ) {
      const isAllChecked = items.every(({ checked }) => checked);

      onChange([{ ...ALL_ITEMS_OPTION, checked: isAllChecked }, ...items]);
    }
  }, [canCheckAll, items, onChange]);

  return (
    <Form>
      {items.map((item) => (
        <div key={item.id} className="mb-3">
          <Form.Check
            onChange={handleOptionsChange}
            type="checkbox"
            id={item.id}
            checked={item.checked}
            label={item.label}
          />
        </div>
      ))}
    </Form>
  );
};
