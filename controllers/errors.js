
exports.get404Page=(reg,res)=>{
    res.status(404).render('404',{title:'Page Not Found'});
    
}