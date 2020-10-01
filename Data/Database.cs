using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using AcmeGames.Models;
using Newtonsoft.Json;

namespace AcmeGames.Data
{
	public class Database
	{
        private static readonly Random          locRandom       = new Random();

		private static IEnumerable<Game>		locGames		= new List<Game>();
		private static IEnumerable<GameKey>		locKeys			= new List<GameKey>();
		private static IEnumerable<Ownership>	locOwnership	= new List<Ownership>();
		private static IEnumerable<User>		locUsers		= new List<User>();

		public Database()
		{
			locGames		= JsonConvert.DeserializeObject<IEnumerable<Game>>(File.ReadAllText(@"Data\games.json"));
			locKeys			= JsonConvert.DeserializeObject<IEnumerable<GameKey>>(File.ReadAllText(@"Data\keys.json"));
			locUsers		= JsonConvert.DeserializeObject<IEnumerable<User>>(File.ReadAllText(@"Data\users.json"));
			locOwnership	= JsonConvert.DeserializeObject<IEnumerable<Ownership>>(File.ReadAllText(@"Data\ownership.json"));
		}

	    // NOTE: This accessor function must be used to access the data.
	    private Task<IEnumerable<T>>
	    PrivGetData<T>(
	        IEnumerable<T>  aDataSource)
	    {
	        var delay = locRandom.Next(150, 1000);
            Thread.Sleep(TimeSpan.FromMilliseconds(delay));

	        return Task.FromResult(aDataSource);
	    }
	}
}
