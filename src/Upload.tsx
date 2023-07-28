import { useState } from 'react'
import './App.css'
import Papa from 'papaparse';

import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';

type Inputs = {
  csv: string
}

function App() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const [list, setList] = useState<string[]>([]);

  const onSubmit: SubmitHandler<Inputs> = ({ csv }) => {
    const [data] = csv;

    Papa.parse(data, {
      complete: function(result) {
        const [, ...rows] = result.data;
        const fullname = rows.map((row: string[]) => {
          const [, name, surname] = row;

          const names = name?.split(' ');
          const surnameStr = surname?.trim().split(' ');
          const surnameLast = surnameStr?.[surnameStr.length - 1];

          const name1 = names?.[0]
          const name2 = names?.[1] ? ` ${names?.[1]}` : '';

          return {
            name: `${name1}${name2}`,
            surname: surnameLast
          };
        });

        setList(fullname);
      }
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>

        <input
          type="file"
          {...register("csv", { required: true })}
        />
        {errors.csv && <span>This field is required</span>}

        <input type="submit" />
      </form>

      <div>
        <div className="paper">
          {list.map(({ name, surname }, index) => (
            <div key={index} className="card">
              <span className="card__name">
                {name}
              </span>
              <span className="card__surname">
                {surname}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
