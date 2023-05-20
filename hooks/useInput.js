import React, { useReducer } from 'react'
//dispatcher
const dispatchHandler = (state, action) => {
    if (action.type === 'USER_INPUT') {
        return InputHandler(action.value, action.validator)
    } else if (action.type === 'IS_TOUCHED') {
        return onBlur(state)
    } else if (action.type === 'SET_INPUT_VALUE') {
        return setInputValue(action.value)
    } else if (action.type === 'RESET_INPUT') {
        return defaultState()
    } else {
        return defaultState()
    }

}

//////////dispatcher actions 

//input 
const InputHandler = (name, validator) => {
    return ({ value: name, isTouched: true, isValid: validator(name) })
}
//events
const onBlur = (state) => {
    return ({ ...state, isTouched: true })
}
const setInputValue = (name) => {
    return ({ value: name, isTouched: true, isValid: false })
}
const defaultState = () => {
    return ({ value: '', isTouched: false, isValid: false, })
}



////////////////////////////////////////////////////////////////////////////////////
//Hook Code
const useInput = (validitionFunction = (param) => { return param; }) => {
    const [inputState, inputDispatcher] = useReducer(dispatchHandler, { value: '', isTouched: false, isValid: false })

    const inputIsInvalid = !inputState.isValid

    //form input handlers
    const inputChangeHandler = event => {
        const value = event.target.value
        inputDispatcher({ type: 'USER_INPUT', value: value, validator: validitionFunction })
    }
    const setInputValueHandler = (stateValue) => {
        inputDispatcher({ type: 'SET_INPUT_VALUE', value: stateValue })
    }
    const inputBlurHandler = () => {
        inputDispatcher({ type: 'IS_TOUCHED' })
    }
    const inputResetHandler = () => {
        inputDispatcher({ type: 'RESET_INPUT' })
    }

    ///////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////
    return { inputState, inputIsInvalid, setInputValueHandler, inputChangeHandler, inputBlurHandler, inputResetHandler };
}

export default useInput