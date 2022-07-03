<h1>Use-Context</h1>

Alpha version of a wrapper around react context to simplify it's creation.
use only react and is typescript compatible.
export 3 modules, a provider, a state hook with selector (not memoized to prevent rerender) and an action hook.


``` 
import {createContext} from "use-context";


type TState = {
  variable1: string,
  variable2: number
}

type TActions = {
  modifyVariable1: (state: TState, payload: string) => TState
  modifyVariable2: (state: TState, payload: number) => TState
}

export const { useStore, Provider, useActions } = createContext<TState, TActions>({
  initialState: {
    variable1: "variable1",
    variable2: 3
  },
  actions: {
    modifyVariable1 : (state, payload  ) => {
      return { ...state,test: payload }
    },
    modifyVariable2 : (state, payload  ) => {
      return { ...state,test: payload }
    },
  }
});


function App() {

  return (
      <Provider>
        <div className="App">
          <SubComponent />
          <SubComponent2 />
        </div>
      </Provider>


  )
}

const SubComponent = () => {
  const {modifyVariable1} = useActions()
  return <button onClick={() => modifyVariable1("newVariable1")}  > update </button>
}

const SubComponent2 = () => {
  const variable1 = useStore(state=> state.variable1)
  return <span>{variable1}</span>;
}



export default App

```
