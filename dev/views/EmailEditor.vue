<template>
	<div>
	<h4>Body:</h4>
    <div class="aligner">
    <vue-editor :proxy="eeditor"  :no-image="true"></vue-editor>
    </div>
    
    <div>
        <button @click="showHTML()" > ShowHTML</button>
    </div>

    <div v-html="html_email" style="margin-top:2em; padding:5px;">

    </div>

    <div class="margin:2em;">
        <textarea v-model="html_email" rows="15" style="width:100%;"></textarea>
    </div>
    
	</div>
</template>
<style scoped>
.ql-snow .ql-toolbar button svg, 
.quillWrapper .ql-snow.ql-toolbar button svg {
    width: auto; 
    height: auto;
}
h4
{
  margin:0;
}

table.aligner
{
  width:100%;
  margin-bottom: 1.5em;
}
table.aligner > tr > td
{
  width:50%;
  padding:0;
}
table.aligner input
{
  width:90%;
}
table.aligner select
{
 width:90%; 
}

div.aligner input[type='text']
{
  width:90%;
}
div.aligner
{
  margin-bottom: 1.5em;
}



</style>
<script>
import  VueEditor  from "../../src/index.js";

export default
{
    name: 'EmailEditor',
    components:
    {
        VueEditor
    },
    props:
    {
        email:{},
        proxy:
            {
                type:Object, 
                default()
                { 
                    return {};
                }
            }

    },
    data()
    {
        return (
        {
            cols: [],
            
            froms:[ {email:'name@website.com', default:false}],
            eeditor:{},
            html_email:''
            
        });
    },
    
    methods:
    {
        
        showHTML()
        {
            
            this.html_email = this.eeditor.getHTML();

            console.log('Email ');
            console.log(this.html_email);
        }


    }
}
</script>