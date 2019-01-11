<template>
  <div id="app">
      <nav>
        <ul>
        <li><router-link to="/">Dashboard</router-link></li>
        <li><router-link to="/basic">Basic Example</router-link></li>
        <li><router-link to="/modules">Adding Modules</router-link></li>
        <li><router-link to="/toolbar">Custom Toolbar</router-link></li>
        <li><router-link to="/images">Images Example</router-link></li>
        <li><router-link to="/email">Email Editor</router-link></li>
        <li><router-link to="/syntax-highlighting">Syntax Highlighting Example</router-link></li>
        
        </ul>
      </nav>
    <router-view/>
  </div>

</template>
<style>
#preview {
  background: #f6f6f6;
  border-left: 3px solid gray;
  padding: 2em;
  margin-left: 1em;
}

@media (min-width: 601px) {
  #preview {
    width: 47%;
  }
}

.ql-disabled {
  opacity: 0.5;
  background: rgba(153, 153, 153, 0.2);
}
nav ul li 
{
  display:inline-block;
  list-style: none;
  margin-right:8px;
}
</style>
