using System.Web;
using System.Web.Optimization;

namespace CPMS_MVC_VIEW
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            //bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
            //            "~/Scripts/jquery-{version}.js",
            //            "~/js/moment/moment.min.js",
            //            "~/js/flot/date.js",
            //            "~/js/datepicker/daterangepicker.js"
            //            ));

            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                      "~/js/jquery.min.js",
                      "~/Scripts/jquery-1.10.2.min.js",
                      "~/js/moment/moment.min.js",
                        "~/js/datepicker/daterangepicker.js",
                        "~/js/flot/date.js"
                      ));
            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));





            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
               "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));
            bundles.Add(new StyleBundle("~/css/css").Include(
                    "~/css/bootstrap.min.css",
                      "~/css/custom.css"
                     ));
        }
    }
}
