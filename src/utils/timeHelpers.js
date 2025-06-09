import moment from 'moment'

export function calculateDueAt (reviewedAt) {
  const timeSinceLastReview = moment().diff(moment(reviewedAt), 'hours')

  const easeFactors = { // TODO define as user settings?
    forgotten: 0,
    difficult: 1,
    easy: 1.3
  }

  return {
    forgotten: moment().add(1, 'days').toDate(),
    difficult: moment().add(easeFactors.difficult * timeSinceLastReview, 'hours').toDate(),
    easy: moment().add(easeFactors.easy * timeSinceLastReview, 'hours').toDate()
  }
}

export function formatDuration (dateFromNow) {
  return moment.duration(moment(dateFromNow).diff(moment())).humanize()
    .replace('un', '1')
    .replace(' jour', 'j')
    .replace(' semaine', 'sem')
    .replace(' an', 'a')
    .replace(' mois', 'mo')
  // return moment.duration(moment().diff(dateFromNow)).humanize()
}
