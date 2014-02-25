﻿using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Breeze.WebApi2;
using BreezeCRM.Models;
using Newtonsoft.Json.Linq;

namespace BreezeCRM.Controllers
{
    [BreezeController]
    public class CustomerController : ApiController
    {
        //TODO - use DI to inject dependencies
        readonly EFContextProvider<NorthwindContext> _contextProvider = new EFContextProvider<NorthwindContext>();

        [HttpGet]
        public string Metadata()
        {
            return _contextProvider.Metadata();
        }

        [HttpGet]
        [BreezeQueryable]
        public IQueryable<Customer> Customers()
        {
            return _contextProvider.Context.Customers;
        }

        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            //TODO - if this were a real world app, we would
            //intercept the POST request and validate
            //http://www.breezejs.com/documentation/efcontextprovider#SaveInterception
            return _contextProvider.SaveChanges(saveBundle);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _contextProvider.Context.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}