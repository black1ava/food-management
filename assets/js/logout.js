window.onload = function(){
  const logout = document.getElementById('logout');

  logout.addEventListener('click', async function(e){
    e.preventDefault();
    await fetch('/logout', {
      method: 'delete'
    });

    window.location = '/';
  });
}