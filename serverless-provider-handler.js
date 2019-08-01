const R = require('ramda');

const awsSpecific_ = fn =>
  R.pipe(
    R.prop('body'),
    JSON.parse,
    fn,
    x => Promise.resolve(x),
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
    x => Promise.resolve(x)
  );

const serverlessHandler = fn =>
  R.cond([
    [R.has('body'), awsSpecific_(fn)],
    [R.has('data'), kubelessSpecific_(fn)],
    [R.T, R.always({error: 'Provider not handled'})]
  ]);

module.exports= {serverlessHandler};