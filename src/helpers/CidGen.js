class CidGen
{
	nextid()
	{
		return 'id_'+Math.random().toString(36).substring(9);
	}
}

export default CidGen;