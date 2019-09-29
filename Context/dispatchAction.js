export default async function dispatchAction(
  dispatch,
  actionType,
  action,
  setNotifSnackbar
) {
  const dev = process.env.NODE_ENV === 'development';
  const onRequest = '_REQUEST';
  const onFailure = '_FAILURE';
  dispatch({ type: actionType + onRequest });
  try {
    await action();
  } catch (error) {
    const response = error.response || {};
    if (dev) console.info('[Error]:', response.data || response);
    const textMessage =
      response.data && response.data.message
        ? response.data.message
        : error.message;
    // if (error.response && error.response.status === 401) {
    //   message.error(textMessage).then(() => {
    //     logout()
    //   })
    // } else {
    setNotifSnackbar && setNotifSnackbar(`${textMessage} ${response.status}`);
    // }
    dispatch({ type: actionType + onFailure, error });
  }
}
