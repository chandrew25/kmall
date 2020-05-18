<?php
/**
 * 定时轮循节假日
 * @category kmall
 * @package web.front.timertask
 * @author skygreen
 */
class FestivalTask extends BaseTask
{
	/**
	 * 定时轮循节假日
	 */
	public function run()
	{
        $year =date("Y");
        $nowdate = UtilDateTime::timestampToDateTime(strtotime("-1 day"));
        $nowdate_y = substr($nowdate,0,4);
        $nowdate_m = substr($nowdate,5,2);
        $nowdate_d = substr($nowdate,8,2);
        $nowdate = $nowdate_y.$nowdate_m.$nowdate_d;

        $result = array();

        /*计算今年的元旦日期并与当前日期进行判断
        如果已经过时，则计算明年元旦的日期
        以下各方法雷同
        */
        $newyear = UtilDateFestival::newyear($year);
        if($newyear['0'].$newyear['1'].$newyear['2'] < $nowdate)
            $newyear = UtilDateFestival::newyear($year+1);
        $hadnewyear = Batchtype::get_one(array("name"=>"元旦套餐"));
        if(!empty($hadnewyear)){
            if($hadnewyear->batchTime != UtilDateTime::dateToTimestamp($newyear['0']."-".$newyear['1']."-".$newyear['2']." 00:00:00")){
                $hadnewyear->batchTime = UtilDateTime::dateToTimestamp($newyear['0']."-".$newyear['1']."-".$newyear['2']." 00:00:00");
                $hadnewyear->update();
            }
        }


        $chineseNewyear = UtilDateFestival::chineseNewyear($year);
        if($chineseNewyear['0'].$chineseNewyear['1'].$chineseNewyear['2'] < $nowdate)
            $chineseNewyear = UtilDateFestival::chineseNewyear($year+1);
        $hadchineseNewyear = Batchtype::get_one(array("name"=>"春节套餐"));
        if(!empty($hadchineseNewyear)){
            if($hadchineseNewyear->batchTime != UtilDateTime::dateToTimestamp($chineseNewyear['0']."-".$chineseNewyear['1']."-".$chineseNewyear['2']." 00:00:00")){
                $hadchineseNewyear->batchTime = UtilDateTime::dateToTimestamp($chineseNewyear['0']."-".$chineseNewyear['1']."-".$chineseNewyear['2']." 00:00:00");
                $hadchineseNewyear->update();
            }
        }

        $womenday = UtilDateFestival::womenday($year);
        if($womenday['0'].$womenday['1'].$womenday['2'] < $nowdate)
            $womenday = UtilDateFestival::womenday($year+1);
        $hadwomenday = Batchtype::get_one(array("name"=>"妇女节套餐"));
        if(!empty($hadwomenday)){
            if($hadwomenday->batchTime != UtilDateTime::dateToTimestamp($womenday['0']."-".$womenday['1']."-".$womenday['2']." 00:00:00")){
                $hadwomenday->batchTime = UtilDateTime::dateToTimestamp($womenday['0']."-".$womenday['1']."-".$womenday['2']." 00:00:00");
                $hadwomenday->update();
            }
        }

        $nationalDay = UtilDateFestival::nationalDay($year);
        if($nationalDay['0'].$nationalDay['1'].$nationalDay['2'] < $nowdate)
            $nationalDay = UtilDateFestival::nationalDay($year+1);
        $hadnationalDay = Batchtype::get_one(array("name"=>"国庆节套餐"));
        if(!empty($hadnationalDay)){
            if($hadnationalDay->batchTime != UtilDateTime::dateToTimestamp($nationalDay."-".$nationalDay."-".$nationalDay." 00:00:00")){
                $hadnationalDay->batchTime = UtilDateTime::dateToTimestamp($nationalDay."-".$nationalDay."-".$nationalDay." 00:00:00");
                $hadnationalDay->update();
            }
        }

        $teacherDay = UtilDateFestival::teacherDay($year);
        if($teacherDay['0'].$teacherDay['1'].$teacherDay['2'] < $nowdate)
            $teacherDay = UtilDateFestival::teacherDay($year+1);
        $hadteacherDay = Batchtype::get_one(array("name"=>"教师节套餐"));
        if(!empty($hadteacherDay)){
            if($hadteacherDay->batchTime != UtilDateTime::dateToTimestamp($teacherDay['0']."-".$teacherDay['1']."-".$teacherDay['2']." 00:00:00")){
                $hadteacherDay->batchTime = UtilDateTime::dateToTimestamp($teacherDay['0']."-".$teacherDay['1']."-".$teacherDay['2']." 00:00:00");
                $hadteacherDay->update();
            }
        }

        $laborDay = UtilDateFestival::laborDay($year);
        if($laborDay['0'].$laborDay['1'].$laborDay['2'] < $nowdate)
            $laborDay = UtilDateFestival::laborDay($year+1);
        $hadlaborDay = Batchtype::get_one(array("name"=>"劳动节套餐"));
        if(!empty($hadlaborDay)){
            if($hadlaborDay->batchTime != UtilDateTime::dateToTimestamp($laborDay['0']."-".$laborDay['1']."-".$laborDay['2']." 00:00:00")){
                $hadlaborDay->batchTime = UtilDateTime::dateToTimestamp($laborDay['0']."-".$laborDay['1']."-".$laborDay['2']." 00:00:00");
                $hadlaborDay->update();
            }
        }

        $motherDay = UtilDateFestival::motherDay($year);
        if($motherDay['0'].$motherDay['1'].$motherDay['2'] < $nowdate)
            $motherDay = UtilDateFestival::motherDay($year+1);
        $hadmotherDay = Batchtype::get_one(array("name"=>"母亲节套餐"));
        if(!empty($hadmotherDay)){
            if($hadmotherDay->batchTime != UtilDateTime::dateToTimestamp($motherDay['0']."-".$motherDay['1']."-".$motherDay['2']." 00:00:00")){
                $hadmotherDay->batchTime = UtilDateTime::dateToTimestamp($motherDay['0']."-".$motherDay['1']."-".$motherDay['2']." 00:00:00");
                $hadmotherDay->update();
            }
        }

        $christmas = UtilDateFestival::christmas($year);
        if($christmas['0'].$christmas['1'].$christmas['2'] < $nowdate)
            $christmas = UtilDateFestival::christmas($year+1);
        $hadchristmas = Batchtype::get_one(array("name"=>"圣诞节套餐"));
        if(!empty($hadchristmas)){
            if($hadchristmas->batchTime != UtilDateTime::dateToTimestamp($christmas['0']."-".$christmas['1']."-".$christmas['2']." 00:00:00")){
                $hadchristmas->batchTime = UtilDateTime::dateToTimestamp($christmas['0']."-".$christmas['1']."-".$christmas['2']." 00:00:00");
                $hadchristmas->update();
            }
        }

        $dragonboat = UtilDateFestival::dragonboat($year);
        if($dragonboat['0'].$dragonboat['1'].$dragonboat['2'] < $nowdate)
            $dragonboat = UtilDateFestival::dragonboat($year+1);
        $haddragonboat = Batchtype::get_one(array("name"=>"端午节套餐"));
        if(!empty($haddragonboat)){
            if($haddragonboat->batchTime != UtilDateTime::dateToTimestamp($dragonboat['0']."-".$dragonboat['1']."-".$dragonboat['2']." 00:00:00")){
                $haddragonboat->batchTime = UtilDateTime::dateToTimestamp($dragonboat['0']."-".$dragonboat['1']."-".$dragonboat['2']." 00:00:00");
                $haddragonboat->update();
            }
        }

        $childrenday = UtilDateFestival::childrenday($year);
        if($childrenday['0'].$childrenday['1'].$childrenday['2'] < $nowdate)
            $childrenday = UtilDateFestival::childrenday($year+1);
        $hadchildrenday = Batchtype::get_one(array("name"=>"儿童节套餐"));
        if(!empty($hadchildrenday)){
            if($hadchildrenday->batchTime != UtilDateTime::dateToTimestamp($childrenday['0']."-".$childrenday['1']."-".$childrenday['2']." 00:00:00")){
                $hadchildrenday->batchTime = UtilDateTime::dateToTimestamp($childrenday['0']."-".$childrenday['1']."-".$childrenday['2']." 00:00:00");
                $hadchildrenday->update();
            }
        }

        $lantern = UtilDateFestival::lantern($year);
        if($lantern['0'].$lantern['1'].$lantern['2'] < $nowdate)
            $lantern = UtilDateFestival::lantern($year+1);
        $hadlantern = Batchtype::get_one(array("name"=>"元宵节套餐"));
        if(!empty($hadlantern)){
            if($hadlantern->batchTime != UtilDateTime::dateToTimestamp($lantern['0']."-".$lantern['1']."-".$lantern['2']." 00:00:00")){
                $hadlantern->batchTime = UtilDateTime::dateToTimestamp($lantern['0']."-".$lantern['1']."-".$lantern['2']." 00:00:00");
                $hadlantern->update();
            }
        }

        $midAutumn = UtilDateFestival::midAutumn($year);
        if($midAutumn['0'].$midAutumn['1'].$midAutumn['2'] < $nowdate)
            $midAutumn = UtilDateFestival::midAutumn($year+1);
        $hadmidAutumn = Batchtype::get_one(array("name"=>"中秋节套餐"));
        if(!empty($hadmidAutumn)){
            if($hadmidAutumn->batchTime != UtilDateTime::dateToTimestamp($midAutumn['0']."-".$midAutumn['1']."-".$midAutumn['2']." 00:00:00")){
                $hadmidAutumn->batchTime = UtilDateTime::dateToTimestamp($midAutumn['0']."-".$midAutumn['1']."-".$midAutumn['2']." 00:00:00");
                $hadmidAutumn->update();
            }
        }

        $doubleninth = UtilDateFestival::doubleninth($year);
        if($doubleninth['0'].$doubleninth['1'].$doubleninth['2'] < $nowdate)
            $doubleninth = UtilDateFestival::doubleninth($year+1);
        $haddoubleninth = Batchtype::get_one(array("name"=>"重阳节套餐"));
        if(!empty($haddoubleninth)){
            if($haddoubleninth->batchTime != UtilDateTime::dateToTimestamp($doubleninth['0']."-".$doubleninth['1']."-".$doubleninth['2']." 00:00:00")){
                $haddoubleninth->batchTime = UtilDateTime::dateToTimestamp($doubleninth['0']."-".$doubleninth['1']."-".$doubleninth['2']." 00:00:00");
                $haddoubleninth->update();
            }
        }

        $result['newyear'] = $hadnewyear->batchTime;
        $result['chineseNewyear'] = $hadchineseNewyear->batchTime;
        $result['womenday'] = $hadwomenday->batchTime;
        $result['nationalDay'] = $hadnationalDay->batchTime;
        $result['teacherDay'] = $hadteacherDay->batchTime;
        $result['laborDay'] = $hadlaborDay->batchTime;
        $result['motherDay'] = $hadmotherDay->batchTime;
        $result['christmas'] = $hadchristmas->batchTime;
        $result['dragonboat'] = $haddragonboat->batchTime;
        $result['childrenday'] = $hadchildrenday->batchTime;
        $result['lantern'] = $hadlantern->batchTime;
        $result['midAutumn'] = $hadmidAutumn->batchTime;
        $result['doubleninth'] = $haddoubleninth->batchTime;

        return $result;
	}
}
?>
