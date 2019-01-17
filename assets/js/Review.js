class Review{
  constructor(au, tx, rt, ai){
    this.authorName = au,
    this.text = tx,
    this.rating = rt,
    this.authorImage = ai || './../../media/png/blank-avatar.png'
  }
}
