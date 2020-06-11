export const successReducer = (state = {}, action) => {
  const { type } = action
  const matches = /(.*)_(START|SUCCESS|FAILURE|CLEAR)/.exec(type)
  if (!matches) return state

  const [, requestName, requestState] = matches
  return {
    ...state,
    [requestName]: requestState === 'SUCCESS',
  }
}