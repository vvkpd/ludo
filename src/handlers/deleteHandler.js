const removePlayer=(req,res)=>{
  delPlayerFromRoom(req,res);
  clearCookies(res);
  res.end();
};

const delPlayerFromRoom = function(req,res){
  let sessionManager = req.app.sessionManager;
  let gamesManager = req.app.gamesManager;
  let gameName=req.cookies.gameName;
  let sessionId = req.cookies.sessionId;
  let playerName = sessionManager.getPlayerBy(sessionId);
  gamesManager.leaveRoom(gameName,playerName);
  sessionManager.deleteSession(sessionId);
};

const clearCookies = function(res) {
  res.clearCookie('gameName',{path:''});
  res.clearCookie('sessionId',{path:''});
  return;
};

// have to move these function from here to some suitable file.
module.exports={
  removePlayer,
  delPlayerFromRoom,
  clearCookies
};
