const R = require('ramda');

const awsSpecific_ = fn =>
  R.pipe(
    R.prop('body'),
    JSON.parse,
    fn,
    R.then(JSON.stringify),
    R.then(
      R.applySpec({
        status: R.always(200),
        body: R.identity
      })
    )
  );

const kubelessSpecific_ = fn =>
  R.pipe(
    R.prop('data'),
    fn,
    R.then(
      R.applySpec({
        status: R.always(200),
        data: R.identity
      })
    )
  );

const serverlessHandler = fn =>
  R.cond([
    [R.has('body'), awsSpecific_(fn)],
    [R.has('data'), kubelessSpecific_(fn)],
    [R.T, R.always({error: 'Provider not handled'})]
  ]);

module.exports= {serverlessHandler};