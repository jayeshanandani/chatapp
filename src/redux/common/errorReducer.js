export const errorReducer = (state = {}, action) => {
  const { type, data } = action
  const matches = /(.*)_(START|FAILURE|CLEAR|SUCCESS)/.exec(type)

  if (!matches) return state

  const [requestName, requestState] = matches
  let errorMessage = ''
  if (requestState === 'FAILURE') errorMessage = data && data.message
  return {
    ...state,
    [requestName]: errorMessage,
  }
}