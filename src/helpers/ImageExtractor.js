
import CidGen from './CidGen';

class ImageExtractor
{
	constructor(id_gen)
	{
		if(id_gen)
		{
			this.id_gen = id_gen;	
		}
		else
		{
			this.id_gen = new CidGen;
		}
	}

	extract(html)
	{
		this.res = {
			html:html,
			images:[]
		}
		var imgTags = html.match(/<img[^>]+>/g);
		if(!imgTags)
		{
			return this.res;
		}

		for(let i=0; i<imgTags.length ;i++)
		{
			let img_tag =imgTags[i];
			
			let src_match = img_tag.match(/src="data:([^;]+);base64\,([^"]+)"/i);
			
			let cid = null;
			for(let s=0;s<this.res.images.length;s++)
			{
				if(this.res.images[s].base64 == src_match[2])
				{
					cid = this.res.images[s].cid;
					break;
				}
			}
			if(!cid)
			{
				cid = this.id_gen.nextid();
				let img =
					{
						cid:cid,
						mime:src_match[1],
						base64:src_match[2]
					};
				this.res.images.push(img);
			}
			
			let img_tag_copy = img_tag.replace(src_match[0], 'src="cid:'+cid+'"')
			html = html.replace(img_tag, img_tag_copy);
		}

		this.res.html = html;

		return this.res;
	}
}

export default ImageExtractor;