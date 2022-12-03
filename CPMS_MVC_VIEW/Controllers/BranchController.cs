using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CPMS_MVC_VIEW.Controllers
{
    public class BranchController : Controller
    {
        // GET: Branch
        public ActionResult Index()
        {
            return View();
        }
    }
}