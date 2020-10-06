using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using AcmeGames.Models;
using Newtonsoft.Json;
using System.Xml.Linq;
using System.Linq;

namespace AcmeGames.Data
{
	//Simulated the DB and saved to memory by using the Singleton pattern
	
	public class Database
	{
        private static readonly Random          locRandom       = new Random();

		private static IEnumerable<Game>		locGames		= new List<Game>();
		private static IEnumerable<GameKey>		locKeys			= new List<GameKey>();
		private static IEnumerable<Ownership>	locOwnership	= new List<Ownership>();
		private static IEnumerable<User>		locUsers		= new List<User>();

		//Instanciate the DB at build and makes it public to Assembly
		private static Database DbInstance = new Database();

		//method to get games to DB with async simulated by accessor function
		public async static Task<IEnumerable<Game>> Games (){
			
			return await DbInstance.PrivGetData<Game>(locGames);
		}

		//method to get users to DB with async simulated by accessor function
		public async static Task<IEnumerable<User>> Users () {
			
			return await DbInstance.PrivGetData<User>(locUsers);
		}

		//method to get ownerships to DB with async simulated by accessor function
		public async static Task<IEnumerable<Ownership>> Ownerships () {
			
			return await DbInstance.PrivGetData<Ownership>(locOwnership);
		}

		//method to get gamekeys to DB with async simulated by accessor function
		public async static Task<IEnumerable<GameKey>> GameKeys (){
			
			return await DbInstance.PrivGetData<GameKey>(locKeys);
		}

		//method to save games to DB with async simulated by accessor function
		public async static void  SaveGames (IEnumerable<Game> games) {

			locGames = await DbInstance.PrivGetData<Game>(games);

		}

		//method to save users to DB with async simulated by accessor function
		public async static void  SaveUsers (IEnumerable<User> users) {

			locUsers = await DbInstance.PrivGetData<User>(users);

		}

		//method to save ownerships to DB with async simulated by accessor function
		public async static void  SaveOwnership (IEnumerable<Ownership> ownership) {

			locOwnership = await DbInstance.PrivGetData<Ownership>(ownership);

		}

		//method to save keys to DB with async simulated by accessor function
		public async static void  SaveGameKeys (IEnumerable<GameKey> keys) {

			locKeys = await DbInstance.PrivGetData<GameKey>(keys);

		}

		private Database()
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
